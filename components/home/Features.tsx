import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Free Delivery',
      description: 'On orders over LKR 5,000',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Quick Service',
      description: 'Same-day delivery available',
      color: 'from-accent-500 to-accent-600',
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: 'Quality Assured',
      description: 'Fresh products guaranteed',
      color: 'from-primary-600 to-primary-700',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: '5km Radius',
      description: 'Serving Ambalangoda area',
      color: 'from-accent-600 to-accent-700',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 -mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div
              className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-4`}
            >
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
