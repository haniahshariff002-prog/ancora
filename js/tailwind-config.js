// Tailwind CDN config. Must load AFTER the Tailwind CDN script.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        sage: '#B7D1BE',
        mist: '#E6F0E7',
        blush: '#F9D9E7',
        rose: '#F8B4D1',
        hotpink: '#FF1493',
        ink: '#17241C',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'Impact', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '5px 5px 0 0 rgba(23,36,28,.9)',
        pink: '5px 5px 0 0 #F8B4D1',
      },
    },
  },
};
