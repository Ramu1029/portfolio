import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center container-px">
      <span className="font-mono text-primary text-sm mb-4">404</span>
      <h1 className="heading-md mb-4">This route doesn't exist.</h1>
      <p className="body-text mb-8">Even the best backends 404 sometimes.</p>
      <Link to="/" className="btn-primary">Back home</Link>
    </div>
  );
}
