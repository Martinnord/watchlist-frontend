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
  AspectRatio,
  Stack,
  Box,
  Text,
  Image,
  Link,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import ReactGA from "react-ga4";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
}

function BuyMeACoffeeButton(props) {
  return (
    <Link isExternal href="https://www.buymeacoffee.com/xaEkLT2PqR" {...props}>
      <Image h="10" alt="Buy Me a Coffee Widget" src="/bmc-button.png" />
    </Link>
  );
}

function App() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm();
  const toast = useToast();

  const onSubmit = async (values) => {
    try {
      if (isProd) {
        ReactGA.event({
          category: "Download",
          action: "Download watchlist",
          label: values.author,
        });
      }
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

        reset();
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
          <Heading size="md">Watchlist to TradingView</Heading>
        </Container>
      </header>
      <main>
        <Container centerContent p={6}>
          <Stack spacing={8} w="full">
            <Box>
              <Heading size="md" mb={2}>
                How to Use
              </Heading>
              <Text>
                If you're unsure how to use this tool, watch the video below:
              </Text>
              <AspectRatio ratio={16 / 9} my={4}>
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/6rUz-cAQ1wI?si=uBOF21gls_n7uG6j"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </AspectRatio>
            </Box>

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
                  {...register("author", { required: true })}
                  placeholder="Select author"
                >
                  <option value="mathovermyth">Mathovermyth</option>
                  <option value="crisp">Crisp</option>
                  <option value="yahoo-finance">Yahoo Finance</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="watchList">Watch List</FormLabel>
                <Textarea
                  id="watchList"
                  type="text"
                  h="20rem"
                  {...register("watchList", { required: true })}
                />
              </FormControl>
              <Stack justify="center" align="center" spacing={3}>
                <Text textAlign="center">
                  If this helped you, <br />
                  consider supporting me with a coffee.
                </Text>
                <BuyMeACoffeeButton />
              </Stack>
              <Button
                mt={4}
                colorScheme="blue"
                isLoading={isSubmitting}
                isDisabled={!isValid}
                type="submit"
              >
                Download
              </Button>
            </VStack>
          </Stack>
        </Container>
      </main>
    </ChakraProvider>
  );
}

export default App;
