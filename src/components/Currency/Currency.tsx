import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { CurrencyWrapper } from './Currency.styled';

interface CurrencyProps {}

interface ICurrencyData {
   currencyCodeA?: number,
   currencyCodeB?: number,
   rateBuy: number,
   rateSell: number,
}

interface ICurrencyArray {
   [index: number]: ICurrencyData,
}

interface IErrorStatus {
   status: number,
}

interface IErrorData {
   message: string,
   code: string,
   name: string,
   response: IErrorStatus,
}

const Currency: FC<CurrencyProps> = () => {

   const baseURL = 'https://api.monobank.ua/bank/currency';

   let iCurrencyArray: ICurrencyArray = [{currencyCodeA: 0, currencyCodeB: 0, rateBuy: 0, rateSell: 0}];
   let iErrorData: IErrorData = {message: 'no msg', code: 'no code', name: 'no name', response: {status: 0}};

   const [currencies, setCurrency] = useState(iCurrencyArray);
   const [error, setError] = useState(iErrorData);

   React.useEffect(() => {
     axios.get(baseURL).
     then((response) => { 
      setCurrency(response.data);
   }).
     catch(error => setError(error)).
     finally(() => {
   });}, [])

   if(!error.response.status) {
      return <h3 style={{color: 'red'}}>{error.code}&nbsp;{error.response.status}</h3>;
   }

   return(
      <CurrencyWrapper>
         Currency is {currencies[0].currencyCodeA}: 
      </CurrencyWrapper>
   );
}

export default Currency;
