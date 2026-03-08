import NavButton from "../../common/nav-button/NavButton";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingModal from "../../setting-modal/SettingModal";
import { useState } from "react";
function Setting() {
  const [openSetting, setOpenSetting] = useState(false);

  return (
    <>
      <NavButton
        icon={SettingsIcon}
        label="Setting"
        onClick={() => setOpenSetting(true)}
      />
      <SettingModal open={openSetting} onClose={() => setOpenSetting(false)} />
    </>
  );
}

export default Setting;
