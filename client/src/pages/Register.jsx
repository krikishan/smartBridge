import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlinePhone } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await registerUser({ name: data.name, email: data.email, password: data.password, mobile: data.mobile });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <motion.div className="auth-card card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <span className="brand-icon">S</span>
            <span className="brand-text">ShopEZ</span>
          </Link>
          <h1>Create Account</h1>
          <p className="text-secondary">Join ShopEZ for the best shopping experience</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrapper">
              <HiOutlineUser className="input-icon" />
              <input {...register('name', { required: 'Name is required' })} className={`form-input input-with-icon ${errors.name ? 'error' : ''}`} placeholder="John Doe" />
            </div>
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-icon-wrapper">
              <HiOutlineMail className="input-icon" />
              <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} type="email" className={`form-input input-with-icon ${errors.email ? 'error' : ''}`} placeholder="you@example.com" />
            </div>
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Mobile (Optional)</label>
            <div className="input-icon-wrapper">
              <HiOutlinePhone className="input-icon" />
              <input {...register('mobile')} className="form-input input-with-icon" placeholder="+91 9876543210" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper">
              <HiOutlineLockClosed className="input-icon" />
              <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} type="password" className={`form-input input-with-icon ${errors.password ? 'error' : ''}`} placeholder="Min. 6 characters" />
            </div>
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn btn-accent btn-lg btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </motion.div>
    </main>
  );
}
