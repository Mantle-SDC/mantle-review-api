import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('http://localhost:3000/reviews/meta?product_id=12');
  sleep(1);
}
