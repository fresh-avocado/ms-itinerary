import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { BusSeatType } from '../enums/busSeatType.enum';

@ValidatorConstraint()
export class ValidCapacity implements ValidatorConstraintInterface {
  validate(capacity: { [key: string]: number }, options: ValidationArguments) {
    let sum = 0;
    if (capacity[BusSeatType.TOURIST] === undefined) {
      return false;
    }
    sum += capacity[BusSeatType.TOURIST];
    if (capacity[BusSeatType.EXECUTIVE] === undefined) {
      return false;
    }
    sum += capacity[BusSeatType.EXECUTIVE];
    if (capacity[BusSeatType.PREMIUM] === undefined) {
      return false;
    }
    sum += capacity[BusSeatType.PREMIUM];

    const minCapacity = options.constraints[0].minCapacity as number;
    const maxCapacity = options.constraints[0].maxCapacity as number;

    if (sum < minCapacity) {
      return false;
    }
    if (sum > maxCapacity) {
      return false;
    }

    return true;
  }
}

export function IsValidCapacity(
  validationOptions?: ValidationOptions & {
    minCapacity: number;
    maxCapacity: number;
  },
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [
        {
          minCapacity: validationOptions.minCapacity,
          maxCapacity: validationOptions.maxCapacity,
        },
      ],
      validator: ValidCapacity,
    });
  };
}
