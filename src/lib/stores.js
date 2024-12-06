import { writable } from 'svelte/store';

export const orderNumber = writable(BigInt(0));

export const nftLink = writable("");

export const provider = writable({});

export const quantity = writable(1);

export const networkError = writable(""); 

export const formData = writable({
  firstName: "",
  lastName: "",
  emailAddress: "",
  streetAddress: "",
  city: "",
  zipCode: "",
  appSuite: "",
  phoneNumber: "",
  selectedState:"",
  // Country drop down
  selected: "",
  });
  
export const paymentSucess = writable(false);
