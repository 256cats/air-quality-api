import { IocContainer } from '@tsoa/runtime';
import { Container } from 'typedi';

// Setting up tsoa controllers to work with typedi https://tsoa-community.github.io/docs/di.html#tsyringe
export const iocContainer: IocContainer = {
  get: <T>(controller: { prototype: T }): T => {
    return Container.get<T>(controller as never);
  },
};
