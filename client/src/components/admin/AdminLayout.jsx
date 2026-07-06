import { Link, useLocation } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlineCube, HiOutlineTag, HiOutlineShoppingBag, HiOutlinePhotograph, HiOutlineArrowLeft } from 'react-icons/hi';
import './Admin.css';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: <HiOutlineChartBar /> },
  { path: '/admin/products', label: 'Products', icon: <HiOutlineCube /> },
  { path: '/admin/categories', label: 'Categories', icon: <HiOutlineTag /> },
  { path: '/admin/orders', label: 'Orders', icon: <HiOutlineShoppingBag /> },
  { path: '/admin/banner', label: 'Banner', icon: <HiOutlinePhotograph /> },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Admin Panel</h3>
          <Link to="/" className="btn btn-ghost btn-sm"><HiOutlineArrowLeft /> Store</Link>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className={`admin-nav-item ${pathname === item.path ? 'active' : ''}`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
