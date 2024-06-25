import React, { FC } from 'react';
import axios from 'axios';
import { CurrencyWrapper } from './Currency.styled';

interface CurrencyProps {}

interface ICurrency {
   currencyCodeA?: number,
   currencyCodeB?: number,
   rateBuy: number,
   rateSell: number,
   testValue: string,
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

   let errorData: IErrorData = {message: 'no msg', code: 'no code', name: 'no name', response: {status: 0}};

   const [post, setPost] = React.useState(null);
   const [error, setError] = React.useState(errorData);

   React.useEffect(() => {
     axios.get(baseURL).
     then((response) => { setPost(response.data['0']);}).
     catch(error => setError(error));}, [post])

   if(error) {
      return <h3 style={{color: 'red'}}>{error.code}&nbsp;{error.response.status}</h3>;
   }

   if(!post) {return <h3 style={{color: 'red'}}>No data</h3>;}

   let currency: ICurrency = {currencyCodeA: 0, currencyCodeB: 0, rateBuy: 0, rateSell: 0, testValue: 'hello world'};
   currency = post as ICurrency;
   // const currency: ICurrency = post;

   return(
      <CurrencyWrapper>
         Currency {post['rateBuy']} Component
         Currency {currency.currencyCodeA} Component
         Currency {currency.testValue} Component
      </CurrencyWrapper>
   );
}

export default Currency;
