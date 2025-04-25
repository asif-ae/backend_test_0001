import { JSONScalar } from '../scalars/json';
import { LongScalar } from '../scalars/long';

export const scalarResolvers = {
  ...JSONScalar,
  ...LongScalar,
};
