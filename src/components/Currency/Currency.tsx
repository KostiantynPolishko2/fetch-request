import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import 'the-new-css-reset';
import { CurrencyWrapper } from './Currency.styled';
import { Dict } from 'styled-components/dist/types';

interface CurrencyProps {}

interface ICurrencyData {
   currencyCodeA?: number,
   currencyCodeB: number,
   date: number,
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

const client = axios.create({
   baseURL: 'https://api.monobank.ua',
})

const nameCurrrency = new Map([[840, 'USD'], [980, 'UAH'], [978, 'EUR']]);

const Currency: FC<CurrencyProps> = () => {

   let iCurrencyArray: ICurrencyArray = [{currencyCodeA: 0, currencyCodeB: 0, date: 0, rateBuy: 0, rateSell: 0}];
   let iErrorData: IErrorData = {message: 'no msg', code: 'no code', name: 'no name', response: {status: 0}};

   const [currencies, setCurrency] = useState(iCurrencyArray);
   const [error, setError] = useState(iErrorData);

   React.useEffect(() => {
     client.get('/bank/currency').
     then((response) => { 
      setCurrency(response.data);
   }).
     catch(error => setError(error)).
     finally(() => {
   });}, [])

   if(!error.response.status) {
      return <h3 style={{color: 'red'}}>{error.code}&nbsp;{error.response.status}</h3>;
   }

   let date = new Date(currencies[0].date * 1000);

   return(
      <CurrencyWrapper>
         <h3>Date: {date.toLocaleDateString()} Time: {date.toLocaleTimeString()}</h3>
         <p>Currency rates for 1{nameCurrrency.get(currencies[0].currencyCodeA??= 0)}:</p>
         <ul>
            <li>buy for&nbsp;<strong style={{color: 'yellow'}}>{currencies[0].rateBuy.toFixed(2)}</strong>{nameCurrrency.get(currencies[0].currencyCodeB??= 0)}</li>
            <li>sell for&nbsp;<strong style={{color: 'red'}}>{currencies[0].rateSell.toFixed(2)}</strong>{nameCurrrency.get(currencies[0].currencyCodeB)}</li>
         </ul>
      </CurrencyWrapper>
   );
}

export default Currency;
