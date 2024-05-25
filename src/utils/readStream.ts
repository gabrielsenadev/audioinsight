
export const readStream = async (
  stream: ReadableStream,
  onReadChunk: (data: string) => void = () => {},
  onFinish: (data: string) => void = () => {},
) => {
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
  let data = "";

  reader.read().then(async function processData({ done, value }) {
    if (done) {
      onFinish(data);
      return;
    }

    try {
      const parsedData = JSON.parse(value.replace("data: ", ""));
      const chunk = parsedData.response;
      data += chunk;
      onReadChunk(chunk);
    } catch (error) {}

    reader.read().then(processData);
  });
};
