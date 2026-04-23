import AppsignalModule from "npm:@appsignal/javascript";

// Interop for Deno where the default export is nested
const Appsignal = AppsignalModule.default || AppsignalModule;

let appsignalInstance: any = null;

export const initAppSignal = () => {
  if (appsignalInstance) return appsignalInstance;

  const key = Deno.env.get("APPSIGNAL_API_KEY");
  if (!key) return null;

  try {
    appsignalInstance = new Appsignal({ key });

    // As requested, triggered to verify connectivity on first initialization
    //appsignalInstance.demo();
    console.log("AppSignal initialized and appsignal.demo() called.");

    return appsignalInstance;
  } catch (err) {
    console.error("Failed to initialize AppSignal:", err);
    return null;
  }
};

export const notifyAppSignalError = async (
  error: unknown,
  userMessage: string,
  route: string,
  tenantId?: string
) => {
  try {
    const appsignal = initAppSignal();
    if (!appsignal) return;

    const errorObj = error instanceof Error ? error : new Error(String(error));

    // In @appsignal/javascript, we use sendError
    appsignal.sendError(errorObj, (span: any) => {
      span.setTags({
        route,
        userMessage,
        environment: tenantId || "unknown"
      });
    });
  } catch (err) {
    console.error("Error sending to AppSignal:", err);
  }
};
