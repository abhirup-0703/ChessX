'use client';
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import FeatureCard from '../components/objects/FeatureCard';
import WhyPlatformSection from '../components/objects/WhyPlatformSection';
import Footer from '../components/objects/Footer';
import { cards, features } from '../data/homePageData';

const HomePageLayout = () => {
  return (
    <PageWrapper>

      <section className="pb-24 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <FeatureCard 
                key={index}
                card={card}
                animationDelay={`${(index + 3) * 150}ms`}
              />
            ))}
          </div>
        </div>
      </section>

      <WhyPlatformSection features={features} />
      
      <Footer />
    </PageWrapper>
  );
};

export default HomePageLayout;