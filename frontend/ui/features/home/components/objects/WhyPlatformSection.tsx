import { Feature } from '@/features/home/data/homePageData';

interface WhyPlatformSectionProps {
  features: Feature[];
}

const WhyPlatformSection = ({ features }: WhyPlatformSectionProps) => (
  <section className="py-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-10 border border-purple-500/20">
        <h3 className="text-2xl font-bold text-center mb-8">
          Why Our Platform?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center group">
              <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-lg font-semibold mb-1">{feature.title}</h4>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyPlatformSection;