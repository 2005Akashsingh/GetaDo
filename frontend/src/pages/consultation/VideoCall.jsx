import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, AlertCircle, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useWebRTC from "../../hooks/useWebRTC";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";

const STATUS_LABEL = {
  connecting: "Setting up your camera & mic...",
  waiting: "Waiting for the other participant to join...",
  "connecting-peer": "Connecting...",
  connected: "Connected",
  ended: "Call ended",
  error: "Something went wrong",
};

const VideoCall = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const mySpeaker = user?.role === "doctor" ? "doctor" : "patient";

  const {
    localStream,
    remoteStream,
    status,
    errorMessage,
    transcript,
    sendTranscriptChunk,
    endCall,
    toggleMic,
    toggleCamera,
  } = useWebRTC(appointmentId, mySpeaker);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [showTranscript, setShowTranscript] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const transcriptEndRef = useRef(null);

  const handleSpeechResult = useCallback((text) => sendTranscriptChunk(text), [sendTranscriptChunk]);

  const { supported: speechSupported } = useSpeechRecognition({
    enabled: status === "connected",
    onResult: handleSpeechResult,
  });

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => {
    if (status === "ended") {
      const timeout = setTimeout(() => navigate(-1), 2000);
      return () => clearTimeout(timeout);
    }
  }, [status, navigate]);

  const handleMicToggle = () => {
    const next = !micOn;
    setMicOn(next);
    toggleMic(next);
  };

  const handleCameraToggle = () => {
    const next = !cameraOn;
    setCameraOn(next);
    toggleCamera(next);
  };

  const handleEndCall = () => {
    endCall();
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-b border-slate-800">
        <div>
          <h1 className="font-bold text-lg">Consultation</h1>
          <p className="text-sm text-slate-400">{STATUS_LABEL[status] || status}</p>
        </div>
        <button
          onClick={() => setShowTranscript((v) => !v)}
          className="btn btn-ghost btn-sm gap-2 text-slate-300"
        >
          <MessageSquare size={18} /> {showTranscript ? "Hide" : "Show"} Transcript
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        <div className="flex-1 relative flex items-center justify-center bg-black min-h-[50vh]">
          {remoteStream ? (
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-400 px-6 text-center">
              {status === "error" ? (
                <>
                  <AlertCircle size={48} className="text-rose-500" />
                  <p className="max-w-sm">{errorMessage || "Unable to join the call."}</p>
                </>
              ) : status === "ended" ? (
                <p>Call ended. Returning...</p>
              ) : (
                <>
                  <Loader2 size={48} className="animate-spin" />
                  <p>{STATUS_LABEL[status] || "Connecting..."}</p>
                </>
              )}
            </div>
          )}

          <div className="absolute bottom-6 right-6 w-32 sm:w-56 aspect-video rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-900">
            {localStream ? (
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                Camera off
              </div>
            )}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 px-6 py-3 rounded-full shadow-xl">
            <button
              onClick={handleMicToggle}
              className={`btn btn-circle ${micOn ? "btn-ghost text-white" : "bg-rose-600 hover:bg-rose-700 border-none text-white"}`}
              title={micOn ? "Mute" : "Unmute"}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button
              onClick={handleCameraToggle}
              className={`btn btn-circle ${cameraOn ? "btn-ghost text-white" : "bg-rose-600 hover:bg-rose-700 border-none text-white"}`}
              title={cameraOn ? "Turn camera off" : "Turn camera on"}
            >
              {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button
              onClick={handleEndCall}
              className="btn btn-circle bg-rose-600 hover:bg-rose-700 border-none text-white"
              title="End call"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        {showTranscript && (
          <div className="w-full md:w-80 shrink-0 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col max-h-[40vh] md:max-h-none">
            <div className="p-4 border-b border-slate-800">
              <h2 className="font-bold text-sm uppercase tracking-wide text-slate-400">Live Transcript</h2>
              {!speechSupported && (
                <p className="text-xs text-amber-400 mt-1">
                  Live transcription isn't supported in this browser. Try Chrome or Edge.
                </p>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {transcript.length === 0 ? (
                <p className="text-sm text-slate-500 italic">Nothing said yet.</p>
              ) : (
                transcript.map((entry, i) => (
                  <div
                    key={i}
                    className={`text-sm ${entry.speaker === mySpeaker ? "text-blue-300" : "text-emerald-300"}`}
                  >
                    <span className="font-bold capitalize">{entry.speaker}: </span>
                    <span className="text-slate-200">{entry.text}</span>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
