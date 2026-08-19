export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// order: the Razorpay order object returned by POST /payments/create-order (response.data)
// keyId: the public Razorpay key id, also returned by that same endpoint (response.key)
export const openRazorpayCheckout = async ({
  order,
  keyId,
  description,
  prefill,
  onSuccess,
  onFailure,
  onDismiss,
}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure?.(new Error("Failed to load payment gateway"));
    return;
  }

  const rzp = new window.Razorpay({
    key: keyId,
    amount: order.amount,
    currency: order.currency,
    name: "GetADoc",
    description,
    order_id: order.id,
    prefill,
    theme: { color: "#570df8" },
    handler: (response) => onSuccess(response),
    modal: { ondismiss: () => onDismiss?.() },
  });

  rzp.on("payment.failed", (response) => onFailure?.(response.error));
  rzp.open();
};
