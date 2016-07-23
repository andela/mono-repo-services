const app = require('express')();
const logger = require('winston');
const hystrixStream = require('hystrixjs').hystrixSSEStream;


function hystrixStreamResponse(request, response) {
  response.append('Content-Type', 'text/event-stream;charset=UTF-8');
  response.append('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
  response.append('Pragma', 'no-cache');
  return hystrixStream.toObservable().subscribe(
    (sseData) => response.write(`data: ${sseData}\n\n`),
    (error) => logger.error(error),
    () => response.end()
  );
}

exports.start = () => {
  app.get('/', hystrixStreamResponse);
  if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT || 9000);
  }
};
