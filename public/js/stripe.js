// تأكد من تحميل Stripe.js في الـ HTML أولاً
// <script src="https://js.stripe.com/v3/"></script>

const stripe = Stripe(
  "pk_test_51TUlLkGrPpdYcyLj7VdBTMDUhS1DinSJYqxymc1y5jTd1Nu52jJCIipQJcGMsNEnopJx8WvI7rWCaOiGVPBwedjo00XFYuGGpO",
);

export const bookTour = async (tourId) => {
  try {
    // local
    // const url = `http://localhost:3000/api/v1/booking/checkout-session/${tourId}`;
    const url = `/api/v1/booking/checkout-session/${tourId}`;
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    // التوجيه المباشر
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.session.id,
    });

    if (error) {
      console.error("Error:", error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
