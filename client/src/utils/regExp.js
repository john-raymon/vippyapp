export const phoneNumber = /^[\+\d]?(?:[\d-.\s()]*)$/;

// password src: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
// Minimum eight characters, atleast one number:
export const password = /^(?=.*?[a-zA-z])(?=.*?[0-9]).{8,}$/;

export const zipCode = /^[0-9]{5}(?:-[0-9]{4})?$/;
