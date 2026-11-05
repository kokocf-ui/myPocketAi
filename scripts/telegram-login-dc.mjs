// One bounded DC redirect for Telegram sign-in, with no network or secrets here.
// Telegram documents PHONE_MIGRATE_X (RPC 303) as a redirect, not a bad number.
export function parsePhoneMigration(error) {
  if(Number(error?.code)!==303)return null;
  const code=String(error?.errorMessage||"");
  const match=/^PHONE_MIGRATE_([1-5])$/.exec(code);
  return match?Number(match[1]):null;
}

export function makePhoneMigrationHandler({switchDC,onOtherError,onRedirect=()=>{},onSwitchFailed=()=>{}}) {
  let switched=false;
  return async function onLoginError(error){
    const dc=parsePhoneMigration(error);
    if(dc!==null && !switched){
      switched=true;
      try{
        await switchDC(dc);
        onRedirect(dc);
        return false; // teleproto retries auth.sendCode ONCE on the new DC
      }catch{
        onSwitchFailed();
        return true; // stop rather than guessing or retrying on DC2
      }
    }
    return Boolean(await onOtherError(error)); // stops on other errors / second migrate
  };
}
