import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import 'the-new-css-reset';
import { CurrencyWrapper } from './Currency.styled';
import { Dict } from 'styled-components/dist/types';

interface CurrencyProps {}

interface ICurrencyData {
   currencyCodeA: number,
   currencyCodeB: number,
   date: number,
   rateBuy: number,
   rateSell: number,
}

class Currency {
   private scale: number = 1000;
   private readonly nameCurrrency = new Map([[0, 'UNKNOWN'], [840, 'USD'], [980, 'UAH'], [978, 'EUR']]);
   NameA?: string;
   NameB?: string;
   date: string;
   time: string;
   rateBuy: number;
   rateSell: number;

   constructor(currency: ICurrencyData){
      this.NameA = this.nameCurrrency.get(currency.currencyCodeA??= 0);
      this.NameB = this.nameCurrrency.get(currency.currencyCodeB??= 0);
      this.date = this.setDate(currency.date);
      this.time = this.setTime(currency.date);
      this.rateBuy = Math.round(currency.rateBuy * 100) / 100;
      this.rateSell = Math.round(currency.rateSell * 100) / 100;
   }

   setDate(date: number): string {
      return new Date(date * this.scale).toLocaleDateString();
   }

   setTime(date: number): string {
      return new Date(date * this.scale).toLocaleTimeString();
   }
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

class Error {
   status: number;
   readonly description: string = 'unknown';

   constructor(error: IErrorData) {
      this.status = error.response.status;
      this.description = this.setDescription(error.name, error.code)
   }

   private setDescription(name: string, code: string): string {
      return `custom description of ${name}: ${code} ${this.status}`;
   }
}

const CurrencyFC: FC<CurrencyProps> = () => {

   // let _currencies: ICurrencyArray = [new Currency({currencyCodeA: 0, currencyCodeB: 0, date: 0, rateBuy: 0, rateSell: 0})];

   let _currency = new Currency({currencyCodeA: 0, currencyCodeB: 0, date: 0, rateBuy: 0, rateSell: 0});
   let _error = new Error({message: 'no msg', code: 'no code', name: 'no name', response: {status: 0}})

   const [currency, setCurrency] = useState(_currency);
   const [error, setError] = useState(_error);

   React.useEffect(() => {
     client.get('/bank/currency').
     then((response) => { 
      setCurrency(new Currency(response.data['0']));
   }).
     catch(error => setError(new Error(error))).
     finally(() => {
   });}, [])

   if(!error.status) {
      return <h3 style={{color: 'red'}}>{error.description}</h3>;
   }

   return(
      <CurrencyWrapper>
         <h3>Date: {currency.date} Time: {currency.time}</h3>
         <p>Currency rates for 1 {currency.NameA}:</p>
         <ul>
            <li>buy for&emsp;<strong style={{color: 'yellow', fontWeight: 600}}>{currency.rateBuy}</strong>&nbsp;{currency.NameB}</li>
            <li>sell for&emsp;<strong style={{color: 'red', fontWeight: 600}}>{currency.rateSell}</strong>&nbsp;{currency.NameB}</li>
         </ul>
      </CurrencyWrapper>
   );
}

export default CurrencyFC;
