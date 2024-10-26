"use client"
// import { candidateSidebarMenu, employerSidebarMenu } from "@faceData/menus";
import { Box, useMediaQuery } from "@mui/material"
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import MuiDrawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import { CSSObject, Theme, styled, useTheme } from "@mui/material/styles"
import React, { useEffect } from "react"
import NavItems from "./NavItems"
import toast from "react-hot-toast"
import { signOut, useSession } from "next-auth/react"
import { SharedMenuList } from "./type"
import CustomAppBar from "../app-bar"
import MobileNav from "./MobileNav"
import { PublicHeaderDataProps } from "../../header/types"

type IProps = {
   SignOut: () => Promise<void>
   sidebarMenus: SharedMenuList
   headerData: PublicHeaderDataProps
   language?: "ar" | "en" | "es" | ""
   changeLang: (lang: string) => void
   changeDirection: (dir: "rtl" | "ltr") => void
   children: React.ReactNode
}

const drawerWidth = 260

const openedMixin = (theme: Theme): CSSObject => ({
   width: drawerWidth,
   marginTop: "73px",
   height: "calc(100% - 75px)",
   transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
   }),
   overflowX: "hidden"
})

const closedMixin = (theme: Theme): CSSObject => ({
   transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
   }),
   overflowX: "hidden",
   width: `0px`
})

interface AppBarProps extends MuiAppBarProps {
   open?: boolean
}

const Drawer = styled(MuiDrawer, {
   shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
   flexShrink: 0,
   whiteSpace: "nowrap",
   boxSizing: "border-box",
   mt: 10,
   ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme)
   }),
   ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme)
   })
}))

export const DrawerHeader: React.FC = styled("div")(({ theme }) => ({
   display: "flex",
   alignItems: "center",
   justifyContent: "space-between",
   padding: theme.spacing(0, 5),
   // necessary for content to be below app bar
   ...theme.mixins.toolbar
}))

export const NavBar = ({
   SignOut,
   headerData,
   sidebarMenus,
   changeDirection,
   changeLang,
   language = "en",
   children
}: IProps) => {
   const { data: session } = useSession()
   const theme = useTheme()
   const [loading, setLoading] = React.useState(false)
   const [open, setOpen] = React.useState(true)
   const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
   const isTablet = useMediaQuery(theme.breakpoints.down("md"))

   const sidebarMenu =
      session?.user?.role?.type === "candidate"
         ? ((sidebarMenus && sidebarMenus?.find((menu) => menu.role === "candidate")?.menus) ?? [])
         : session?.user?.role?.type === "employer"
           ? ((sidebarMenus && sidebarMenus?.find((menu) => menu.role === "employer")?.menus) ?? [])
           : ((sidebarMenus && sidebarMenus?.find((menu) => menu.role === "candidate")?.menus) ?? [])

   useEffect(() => {
      if (isTablet) {
         setOpen(false)
      } else {
         setOpen(true)
      }
   }, [isTablet])

   const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget)
   }

   const handleCloseUserMenu = () => {
      setAnchorElUser(null)
   }

   const handleDrawerOpen = () => {
      setOpen(true)
   }

   const LogOutHandler = async () => {
      setLoading(true)
      await signOut().then(() => {
         SignOut().then(() => {
            toast.success("Logout successfully", {
               duration: 5000
            })
            setLoading(false)
         })
      })
   }

   return (
      <Box sx={{ display: "flex" }}>
         <CustomAppBar
            open={open}
            handleDrawerOpen={handleDrawerOpen}
            handleOpenUserMenu={handleOpenUserMenu}
            handleCloseUserMenu={handleCloseUserMenu}
            anchorElUser={anchorElUser}
            SignOut={SignOut}
            headerData={headerData}
            changeLang={changeLang}
            lang={language}
            changeDirection={changeDirection}
         />
         {/* Desktop */}
         {!isTablet && (
            <Drawer anchor={theme.direction === "rtl" ? "right" : "left"} variant='permanent' open={open}>
               <List sx={{ py: 2, px: 1.5 }}>
                  {NavItems(sidebarMenu, open, theme.direction as any)}
                  {/* Logout */}
                  {/* <ListItem sx={{ display: "block", py: 0, mb: 1, px: 0 }}>
                     <LoadingButton
                        onClick={() => {
                           LogOutHandler()
                        }}
                        fullWidth
                        loading={loading}
                        loadingPosition='end'
                        sx={{
                           justifyContent: open ? "initial" : "center",
                           pl: 2,
                           pr: 1,
                           height: "38px",
                           borderRadius: "6px",
                           color: theme.palette.text.primary + " !important",
                           gap: 1,
                           fontSize: "16px",
                           fontWeight: 500,
                           "&:hover": {
                              backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText + " !important",

                              "& svg": {
                                 color: theme.palette.primary.contrastText + " !important"
                              },

                              "& .MuiChip-root": {
                                 backgroundColor: theme.palette.primary.contrastText + " !important",
                                 color: theme.palette.primary.main + " !important"
                              }
                           },
                           // disabled
                           "& .MuiButton-root.Mui-disabled": {
                              backgroundColor: theme.palette.divider,
                              color: theme.palette.text.disabled + " !important",

                              "& svg": {
                                 color: theme.palette.text.disabled + " !important"
                              }
                           }
                        }}>
                        <CIcon
                           icon={"solar:logout-linear"}
                           size={22}
                           sx={{
                              color: theme.palette.text.primary + "60",
                              flex: "none"
                           }}
                        />
                        Logout
                     </LoadingButton>
                  </ListItem> */}
               </List>
            </Drawer>
         )}

         {/* Mobile  */}
         {isTablet && (
            <MobileNav
               open={open}
               setOpen={setOpen}
               SignOut={SignOut}
               headerData={headerData}
               changeDirection={changeDirection}
               changeLang={changeLang}
               lang={language}
               sidebarMenus={sidebarMenus}
            />
         )}
         <Box sx={{ width: "100%" }}>
            <DrawerHeader />
            <Box component='main' sx={{ flexGrow: 1, p: 3, pb: 0 }}>
               {children}
            </Box>
         </Box>
      </Box>
   )
}
