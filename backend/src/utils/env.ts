export function getEnv(name: string) {
  const val = process.env[name];
  if (typeof val === 'undefined' || val === null || val === '') {
    throw `Env var ${name} not set`;
  }
  return val;
}
