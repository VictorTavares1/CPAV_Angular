import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const requestWithCredentials = request.clone({
    withCredentials: true,
  });

  return next(requestWithCredentials);
};
