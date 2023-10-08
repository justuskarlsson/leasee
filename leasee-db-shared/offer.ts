export interface OfferI {
  model: string;
  manufacturer: string;
  price: number;
  link: string;
  imageUrl?: string;
  extra: string [];
}

export function validateCar(car: Object) : OfferI | null{
  let valid = true;
  valid &&= "model" in car;
  valid &&= "manufacturer" in car;
  valid &&= (
    "price" in car &&
    typeof car.price == "number" &&
    car.price > 1000 &&
    car.price < 20000
  );
  valid &&= (
    "link" in car &&
    typeof car.link == "string" &&
    car.link.length > 5
  );
  if (!valid) {
    return null;
  } else {
    return car as OfferI;
  }
}


