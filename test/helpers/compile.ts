import webpack from "webpack";

export default (
  webpackVersion: 4 | 5,
  compiler: webpack.Compiler
): Promise<Error | webpack.Stats> => {
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      const returnResult = () => {
        if (error) reject(error);
        else resolve(stats);
      };

      if (webpackVersion === 5)
        // @ts-expect-error
        compiler.close(returnResult);
      else returnResult();
    });
  });
};
