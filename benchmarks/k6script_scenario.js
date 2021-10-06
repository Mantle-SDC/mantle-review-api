import http from 'k6/http';
import { group, sleep } from 'k6';

export const options = {
  scenarios: {
    local_get_reviews: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 2000,
      maxVUs: 4000,
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<50'],
    http_req_failed: ['rate<0.01'],
  },
};

export default () => {
  group('GET /reviews', () => {
    http.get('http://localhost:3000/reviews?product_id=100');
    http.get('http://localhost:3000/reviews/meta?product_id=100');
  });
};
