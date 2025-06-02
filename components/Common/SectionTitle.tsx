import React from 'react';

const SectionTitle = ({
  title,
  paragraph,
  width = '570px',
  center,
  mb = '100px',
}: {
  title: string;
  paragraph: string;
  width?: string;
  center?: boolean;
  mb?: string;
}) => {
  return (
    <div
      className={`w-full ${center ? 'mx-auto text-center' : ''}`}
      style={{ maxWidth: width, marginBottom: mb }}
    >
      <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="text-muted-foreground">{paragraph}</p>
    </div>
  );
};

export default SectionTitle;
