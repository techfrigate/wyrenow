import React, { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Clock, 
  CheckCircle,
  Plus,
  Minus,
  CreditCard,
  Calendar,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface RepurchaseProduct {
  id: string;
  name: string;
  pv: number;
  price: number;
  discountPrice: number;
  image: string;
  description: string;
  inStock: number;
}

interface CartItem {
  product: RepurchaseProduct;
  quantity: number;
}

interface RepurchaseOrder {
  id: string;
  userId: string;
  username: string;
  products: CartItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  paymentMethod: string;
}

export default function RepurchaseManagement() {
  const { currency } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'history'>('products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const repurchaseProducts: RepurchaseProduct[] = [
    {
      id: 'small-bottle',
      name: 'Small Health Bottle',
      pv: 25,
      price: 8500,
      discountPrice: 7650, // 10% discount
      image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Premium health supplement in small bottle',
      inStock: 150
    },
    {
      id: 'big-bottle',
      name: 'Big Health Bottle',
      pv: 50,
      price: 15000,
      discountPrice: 13500, // 10% discount
      image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Premium health supplement in large bottle',
      inStock: 120
    },
    {
      id: 'wellness-kit',
      name: 'Complete Wellness Kit',
      pv: 75,
      price: 22000,
      discountPrice: 19800, // 10% discount
      image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Comprehensive wellness package with multiple products',
      inStock: 80
    },
    {
      id: 'family-pack',
      name: 'Family Health Pack',
      pv: 100,
      price: 28000,
      discountPrice: 25200, // 10% discount
      image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Complete family health solution with multiple products',
      inStock: 60
    }
  ];

  const recentOrders: RepurchaseOrder[] = [
    {
      id: 'RP001',
      userId: 'user123',
      username: 'johnsmith',
      products: [
        { product: repurchaseProducts[0], quantity: 2 },
        { product: repurchaseProducts[1], quantity: 1 }
      ],
      totalAmount: 28800,
      discount: 2880,
      finalAmount: 25920,
      status: 'completed',
      date: '2024-01-20',
      paymentMethod: 'Repurchase Wallet'
    },
    {
      id: 'RP002',
      userId: 'user456',
      username: 'janesmith',
      products: [
        { product: repurchaseProducts[2], quantity: 1 }
      ],
      totalAmount: 19800,
      discount: 1980,
      finalAmount: 17820,
      status: 'processing',
      date: '2024-01-19',
      paymentMethod: 'Repurchase Wallet'
    },
    {
      id: 'RP003',
      userId: 'user789',
      username: 'mikejohnson',
      products: [
        { product: repurchaseProducts[3], quantity: 1 }
      ],
      totalAmount: 25200,
      discount: 2520,
      finalAmount: 22680,
      status: 'pending',
      date: '2024-01-18',
      paymentMethod: 'Repurchase Wallet'
    }
  ];

  const teamMembers = [
    { id: 'user123', username: 'johnsmith', name: 'John Smith' },
    { id: 'user456', username: 'janesmith', name: 'Jane Smith' },
    { id: 'user789', username: 'mikejohnson', name: 'Mike Johnson' },
    { id: 'user101', username: 'sarahwilson', name: 'Sarah Wilson' }
  ];

  const addToCart = (product: RepurchaseProduct) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      updateCartQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCart(prev => [...prev, { product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getTotalDiscount = () => {
    return cart.reduce((sum, item) => sum + ((item.product.price - item.product.discountPrice) * item.quantity), 0);
  };

  const getFinalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'processing':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const handleCheckout = () => {
    if (!selectedUser || cart.length === 0) {
      alert('Please select a user and add products to cart');
      return;
    }
    setShowCheckout(true);
  };

  const confirmOrder = () => {
    alert('Repurchase order created successfully!');
    setCart([]);
    setSelectedUser('');
    setShowCheckout(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Repurchase Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage product repurchases for your team members
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Checkout ({cart.length})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Orders',
            value: '47',
            change: '+3 this month',
            icon: Package,
            color: 'bg-blue-500'
          },
          {
            title: 'This Month Revenue',
            value: formatCurrency(125000),
            change: '+15.2%',
            icon: TrendingUp,
            color: 'bg-green-500'
          },
          {
            title: 'Pending Orders',
            value: '5',
            change: '2 processing',
            icon: Clock,
            color: 'bg-amber-500'
          },
          {
            title: 'Completed Orders',
            value: '42',
            change: '89% success rate',
            icon: CheckCircle,
            color: 'bg-purple-500'
          }
        ].map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'products', name: 'Products', icon: Package },
              { id: 'orders', name: 'Recent Orders', icon: ShoppingCart },
              { id: 'history', name: 'Order History', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Team Member for Repurchase
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full max-w-md px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a team member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.username})
                    </option>
                  ))}
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {repurchaseProducts.map(product => (
                  <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.description}</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="text-sm bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded">
                          10% OFF
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(product.discountPrice)}
                        </span>
                        <span className="text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded">
                          {product.pv} PV
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Stock: {product.inStock}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Save: {formatCurrency(product.price - product.discountPrice)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={!selectedUser}
                      className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>

              {/* Shopping Cart */}
              {cart.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Shopping Cart
                  </h3>
                  
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatCurrency(item.product.discountPrice)} • {item.product.pv} PV
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              Save: {formatCurrency(item.product.price - item.product.discountPrice)} per item
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatCurrency(item.product.discountPrice * item.quantity)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              {formatCurrency(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(getTotalAmount())}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600 dark:text-green-400">Discount:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          -{formatCurrency(getTotalDiscount())}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-900 dark:text-white">Total:</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatCurrency(getFinalAmount())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Orders
                </h3>
                <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Products</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Discount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Final Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {order.username}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {order.products.length} items
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-3 px-4 font-medium text-green-600 dark:text-green-400">
                          -{formatCurrency(order.discount)}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {formatCurrency(order.finalAmount)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Order History
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Complete order history with advanced filtering and analytics will be displayed here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Confirm Repurchase Order
            </h3>
            
            <div className="space-y-6">
              {/* User Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order For:</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {teamMembers.find(m => m.id === selectedUser)?.name} ({teamMembers.find(m => m.id === selectedUser)?.username})
                </p>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Summary</h4>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity} • {formatCurrency(item.product.discountPrice)} each
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.product.discountPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-400">Subtotal:</span>
                    <span className="font-medium text-blue-800 dark:text-blue-200">
                      {formatCurrency(getTotalAmount())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-400">Discount (10%):</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -{formatCurrency(getTotalDiscount())}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 dark:border-blue-700 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-blue-800 dark:text-blue-200">Total Amount:</span>
                      <span className="font-bold text-blue-900 dark:text-blue-100 text-lg">
                        {formatCurrency(getFinalAmount())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Payment Method</h4>
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Repurchase Wallet</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Available Balance: {formatCurrency(85000)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}