const app = require('express')();
const logger = require('epic_logger');
const hystrixStream = require('hystrixjs').hystrixSSEStream;
const VError = require('verror');


function hystrixStreamResponse(request, response) {
  response.append('Content-Type', 'text/event-stream;charset=UTF-8');
  response.append('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
  response.append('Pragma', 'no-cache');
  return hystrixStream.toObservable().subscribe(
    (sseData) => response.write(`data: ${sseData}\n\n`),
    (error) => logger.error(new VError(error, 'Failed to subscribe to stream')),
    () => response.end()
  );
}

exports.start = () => {
  app.get('/', hystrixStreamResponse);
  if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT || 9000);
  }
};
