export default function Landing() {
  const { user } = useAuth();

  return (
    <>
      <section className="hero">
        <h1>Give your old books a new home</h1>
        <p>
          ReleafBook is a small marketplace for second-hand books. Sell the books you have finished,
          find the ones you need, and agree on a fair price directly with the other student.
        </p>
        <div className="hero-buttons">
          <Link to="/books" className="btn">Browse Books</Link>
          {user ? (
            <Link to="/dashboard" className="btn btn-outline">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Log In</Link>
              <Link to="/register" className="btn btn-outline">Sign Up</Link>
            </>
          )}
        </div>
      </section>

      <section>
        <h2 className="center">How it works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <h3>List a book</h3>
            <p>Upload a photo, add the title, author and your asking price.</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>Make an offer</h3>
            <p>Found a book you like? Offer the price you are happy to pay.</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Negotiate</h3>
            <p>The seller can accept, reject or counter. Keep going until you agree.</p>
          </div>
          <div className="step">
            <span className="step-number">4</span>
            <h3>Meet and pay</h3>
            <p>Once agreed, you get the seller's contact details to arrange payment and delivery.</p>
          </div>
        </div>
        <p className="center muted">Every user can both buy and sell with the same account.</p>
      </section>
    </>
  );
}
