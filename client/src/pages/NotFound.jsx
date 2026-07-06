import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <main className="container" style={{ padding: '96px 24px', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 style={{ fontSize: 96, fontWeight: 800, color: 'var(--color-border)', marginBottom: 8 }}>404</h1>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Page not found</h2>
        <p className="text-secondary" style={{ marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-accent btn-lg">Back to Home</Link>
      </motion.div>
    </main>
  );
}
