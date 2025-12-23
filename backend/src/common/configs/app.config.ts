import { registerAs } from '@nestjs/config';
import { ConfigName } from '../types/enums/config-name.enum';
import { NodeEnvironment } from '../types/enums/node-environment.enum';

export interface IAppConfig {
  port: number;
  nodeEnv: NodeEnvironment;
}

export default registerAs(ConfigName.APP, () => {
  const port = +process.env.PORT || 5000;
  const nodeEnv = process.env.NODE_ENV
    ? (process.env.NODE_ENV as NodeEnvironment)
    : NodeEnvironment.DEV;

  const config: IAppConfig = {
    port,
    nodeEnv,
  };

  return config;
});
