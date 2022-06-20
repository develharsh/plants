export default (error) => {
  let code = 500,
    message = error.message;
  if (error.code === 11000) {
    //error by mongodb
    //violation of unique:true
    message = error.message;
    message = `${message.split('{ : "')[1].replace(`" }`, "")} already exists`;
  } else if (error.errors) {
    //error by mongoose
    code = 400;
    const key = error.errors[Object.keys(error.errors)[0]];
    if (key.kind && key.kind == "ObjectId") message = `${key.path} is invalid.`;
    else if (key.properties && key.properties.type == "required")
      message = `${key.properties.path} is missing.`;
    else if (key.properties && key.properties.type == "enum")
      message = `${key.properties.path} is invalid.`;
    else if (key.properties && key.properties.type == "user defined")
      message = key.properties.message;
  }
  return { code, message };
};
