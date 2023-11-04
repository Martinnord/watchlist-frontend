import {
  ChakraProvider,
  Button,
  FormControl,
  FormLabel,
  Container,
  VStack,
  useToast,
  Textarea,
  Heading,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

function App() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { author: "mathovermyth", watchList: "" } });
  const toast = useToast();

  const onSubmit = async (values) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/create-watchlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        // Assuming your server responds with the downloadable file URL
        const blob = await response.blob();
        const contentDisposition = response.headers.get("Content-Disposition");
        const filename = contentDisposition
          .split("filename=")[1]
          .split(";")[0]
          .replaceAll('"', "");

        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        toast({
          title: "Download Successful",
          description: "Your file has been downloaded.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.log("error", error);
      toast({
        title: "An error occurred.",
        description: "Unable to download the file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <header>
        <Container p={6} m="0">
          <Heading size="md">Watchlist to Trading View</Heading>
        </Container>
      </header>
      <main>
        <Container centerContent p={6}>
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={4}
            align="stretch"
            w="full"
          >
            <FormControl isRequired>
              <FormLabel htmlFor="author">Author</FormLabel>
              <Select
                id="author"
                {...register("author")}
                placeholder="Select author"
              >
                <option value="mathovermyth">mathovermyth</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="watchList">Watch List</FormLabel>
              <Textarea
                id="watchList"
                type="text"
                h="20rem"
                {...register("watchList")}
              />
            </FormControl>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Download
            </Button>
          </VStack>
        </Container>
      </main>
    </ChakraProvider>
  );
}

export default App;
