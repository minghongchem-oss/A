exports.handler = async function () {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      service: 'unspun-api-netlify',
      date: new Date().toISOString(),
    }),
  };
};
