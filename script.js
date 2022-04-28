import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  InsecureSkipTLSVerify: true,
  noConnectionReuse: true,
/*   scenarios : {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 500,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 200,
      maxVUs: 1000
    } */
    stages: [
      { duration: '12s', target: 100 }, // below normal load
      { duration: '12s', target: 500 },
      { duration: '12s', target: 1000 }, // normal load
      { duration: '12s', target: 500 },
      { duration: '12s', target: 200 }, // around the breaking point
      { duration: '20s', target: 0 },
    ]
};
export default function () {
  http.get(`http://localhost:3000/qa/questions?product_id=${(Math.random() * 100000) + 900000}`);

  sleep(1);
}
