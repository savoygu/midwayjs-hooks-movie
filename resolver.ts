import type { BootstrapVue3ResolverOptions } from 'unplugin-vue-components/resolvers';
import type { ComponentResolver } from 'unplugin-vue-components/types';

export const BootstrapVueNextResolver = (
  _options: BootstrapVue3ResolverOptions = {}
): Array<ComponentResolver> => {
  const options = { directives: true, ..._options };
  const resolvers: Array<ComponentResolver> = [
    {
      type: 'component',
      resolve: name => {
        if (name.match(/^B[A-Z]/)) {
          return { name, from: 'bootstrap-vue-next' };
        }
      },
    },
  ];

  if (options.directives) {
    resolvers.push({
      type: 'directive',
      resolve: name => {
        if (name.match(/^B[A-Z]/))
          return { name: `V${name}`, from: 'bootstrap-vue-next' };
      },
    });
  }

  return resolvers;
};
