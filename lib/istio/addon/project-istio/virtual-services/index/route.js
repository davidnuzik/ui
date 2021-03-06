import { on } from '@ember/object/evented';
import { get, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import C from 'ui/utils/constants';

export default Route.extend({
  session:      service(),

  model(params, transition) {
    const store = get(this, 'store');
    const projectId = transition.params['authenticated.project'].project_id;

    return store.findAll('virtualservice')
      .then((data) => {
        return {
          data,
          supported: true,
          projectId,
        }
      })
      .catch(() => {
        return {
          data:      [],
          supported: false,
          projectId,
        }
      });
  },

  setDefaultRoute: on('activate', function() {
    setProperties(this, {
      [`session.${ C.SESSION.ISTIO_ROUTE }`]:   'virtual-services',
      [`session.${ C.SESSION.PROJECT_ROUTE }`]: 'authenticated.project.istio.project-istio.virtual-services'
    });
  }),
});
