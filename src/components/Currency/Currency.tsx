import React, { FC } from 'react';
import { CurrencyWrapper } from './Currency.styled';

interface CurrencyProps {}

const Currency: FC<CurrencyProps> = () => (
 <CurrencyWrapper>
    Currency Component
 </CurrencyWrapper>
);

export default Currency;
