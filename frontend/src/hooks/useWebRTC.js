import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

// status: "connecting" | "waiting" | "connecting-peer" | "connected" | "ended" | "error"
export default function useWebRTC(appointmentId, mySpeaker) {
  const socket = useSocket();

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [status, setStatus] = useState("connecting");
  const [errorMessage, setErrorMessage] = useState(null);
  const [transcript, setTranscript] = useState([]);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc-ice-candidate", { appointmentId, candidate: event.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setStatus("connected");
      } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        setStatus("error");
        setErrorMessage("The call connection was lost.");
      }
    };

    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    pcRef.current = pc;
    return pc;
  }, [socket, appointmentId]);

  const flushPendingCandidates = useCallback(async (pc) => {
    const candidates = pendingCandidatesRef.current;
    pendingCandidatesRef.current = [];
    for (const candidate of candidates) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("[webrtc] failed to add queued ICE candidate:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!socket || !appointmentId) return;
    let cancelled = false;

    const handlePeerJoined = async () => {
      // We were already in the room, so we're the one who initiates the offer to the new joiner
      try {
        const pc = createPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("webrtc-offer", { appointmentId, offer });
        setStatus("connecting-peer");
      } catch (err) {
        console.error("[webrtc] failed to create offer:", err);
        setStatus("error");
        setErrorMessage("Failed to start the call connection.");
      }
    };

    const handleOffer = async ({ offer }) => {
      try {
        const pc = pcRef.current || createPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        await flushPendingCandidates(pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc-answer", { appointmentId, answer });
        setStatus("connecting-peer");
      } catch (err) {
        console.error("[webrtc] failed to answer offer:", err);
        setStatus("error");
        setErrorMessage("Failed to answer the incoming call.");
      }
    };

    const handleAnswer = async ({ answer }) => {
      const pc = pcRef.current;
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        await flushPendingCandidates(pc);
      } catch (err) {
        console.error("[webrtc] failed to apply answer:", err);
        setStatus("error");
        setErrorMessage("Failed to complete the call connection.");
      }
    };

    const handleIceCandidate = async ({ candidate }) => {
      const pc = pcRef.current;
      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("[webrtc] failed to add ICE candidate:", err);
        }
      } else {
        pendingCandidatesRef.current.push(candidate);
      }
    };

    const handlePeerLeft = () => {
      setRemoteStream(null);
      setStatus("waiting");
      pcRef.current?.close();
      pcRef.current = null;
    };

    const handleTranscriptChunk = (chunk) => {
      setTranscript((prev) => [...prev, chunk]);
    };

    const handleCallEnded = () => {
      setStatus("ended");
    };

    socket.on("peer-joined", handlePeerJoined);
    socket.on("webrtc-offer", handleOffer);
    socket.on("webrtc-answer", handleAnswer);
    socket.on("webrtc-ice-candidate", handleIceCandidate);
    socket.on("peer-left", handlePeerLeft);
    socket.on("transcript-chunk", handleTranscriptChunk);
    socket.on("call-ended", handleCallEnded);

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        setLocalStream(stream);

        socket.emit("join-room", appointmentId, (result) => {
          if (cancelled) return;
          if (!result.success) {
            setStatus("error");
            setErrorMessage(result.message || "Unable to join this call.");
            return;
          }
          setStatus(result.otherParticipants > 0 ? "connecting-peer" : "waiting");
        });
      } catch (err) {
        if (!cancelled) {
          console.error("[webrtc] failed to get camera/mic or join room:", err);
          setStatus("error");
          setErrorMessage("Camera/microphone access is required to join the call.");
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      socket.off("peer-joined", handlePeerJoined);
      socket.off("webrtc-offer", handleOffer);
      socket.off("webrtc-answer", handleAnswer);
      socket.off("webrtc-ice-candidate", handleIceCandidate);
      socket.off("peer-left", handlePeerLeft);
      socket.off("transcript-chunk", handleTranscriptChunk);
      socket.off("call-ended", handleCallEnded);
      socket.emit("leave-room", appointmentId);
      pcRef.current?.close();
      pcRef.current = null;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    };
  }, [socket, appointmentId, createPeerConnection, flushPendingCandidates]);

  // The server only relays transcript chunks to the OTHER participant, so we
  // append our own utterances locally to keep both sides' transcripts in sync.
  const sendTranscriptChunk = useCallback(
    (text) => {
      if (!socket || !text) return;
      socket.emit("transcript-chunk", { appointmentId, text });
      setTranscript((prev) => [...prev, { speaker: mySpeaker, text, timestamp: new Date().toISOString() }]);
    },
    [socket, appointmentId, mySpeaker]
  );

  const endCall = useCallback(() => {
    socket?.emit("end-call", { appointmentId });
  }, [socket, appointmentId]);

  const toggleMic = useCallback((enabled) => {
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }, []);

  const toggleCamera = useCallback((enabled) => {
    localStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }, []);

  return {
    localStream,
    remoteStream,
    status,
    errorMessage,
    transcript,
    sendTranscriptChunk,
    endCall,
    toggleMic,
    toggleCamera,
  };
}
