# Generate the library.
target "generate" {
  output = ["type=local,dest=dist/lib"]
  pull = true
  args = {
    ELM_FONTAWESOME_VERSION = "${ELM_FONTAWESOME_VERSION}"
  }
}

# The version to put in the generated elm.json file.
variable "ELM_FONTAWESOME_VERSION" {
  default = ""
}

# Generate the example project using the generated library.
target "example" {
  context = "./base/example"
  output = ["type=local,dest=dist/example"]
  pull = true
  contexts = {
    fontawesome = "target:generate"
  }
}

group "default" {
  targets = [ "generate" ]
}
