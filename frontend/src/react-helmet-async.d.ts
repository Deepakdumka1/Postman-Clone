declare module 'react-helmet-async' {
  import React from 'react';

  interface HelmetProps {
    [key: string]: any;
  }

  export class Helmet extends React.Component<HelmetProps> {
    static defaultProps: any;
  }

  export class HelmetProvider extends React.Component<any> {
    static canUseDOM: boolean;
  }
} 