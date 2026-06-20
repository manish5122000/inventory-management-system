export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  type = "button",
  ...props 
}) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-900",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/20",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-600/20",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
