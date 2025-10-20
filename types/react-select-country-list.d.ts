declare module 'react-select-country-list' {
  interface Country {
    label: string;
    value: string;
  }

  export default function countryList(): {
    getData: () => Country[];
    getLabels: () => string[];
  };
}
