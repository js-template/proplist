"use client"
import MenuIcon from "@mui/icons-material/Menu"
import { LoadingButton } from "@mui/lab"
import { Avatar, Divider, Stack, Tooltip, useTheme } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import _ from "lodash"
import { signOut, useSession } from "next-auth/react"
import NextLink from "next/link"

import { hexToRGBA } from "@/lib/hex-to-rgba"
import { SignOut } from "@/lib/user"
import useThemeToggle from "@/next-theme/useThemeToggle"
import Image from "next/image"
import { usePathname } from "next/navigation"
import * as React from "react"
import toast from "react-hot-toast"
import { CIcon } from "@padma/metajob-ui"
import { useGlobalContext } from "@/context/store"
import { getLanguageValue } from "@/utils/common"

const Header = () => {
   const theme = useTheme()

   const [loading, setLoading] = React.useState(false)
   const { toggleTheme, mode } = useThemeToggle()
   const { lang, changeLang, changeDirection, layoutData } = useGlobalContext()
   const currentPath = usePathname()
   const { data, status } = useSession()
   const logo =
      mode === "light"
         ? layoutData?.light_logo?.logo?.data?.attributes?.url
         : layoutData?.dark_logo?.logo?.data?.attributes?.url
   const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
   const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
   // *** Language Menu ***
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
   const openLang = Boolean(anchorEl)
   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
   }
   const handleClose = () => {
      setAnchorEl(null)
   }
   const langMenu = layoutData?.langMenu ?? []

   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNav(event.currentTarget)
   }
   const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget)
   }

   const handleCloseNavMenu = () => {
      setAnchorElNav(null)
   }

   const handleCloseUserMenu = () => {
      setAnchorElUser(null)
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
      <AppBar
         position='static'
         sx={{
            backgroundColor: "background.paper",
            shadow: "0px 4px 8px 0px rgba(19, 22, 28, 0.12)",
            py: "6px",
            backgroundImage: "none"
         }}
         //elevation={4}
      >
         <Container maxWidth='lg' sx={{ width: "100%" }}>
            <Toolbar disableGutters>
               {logo && (
                  <Box
                     sx={{
                        display: { xs: "none", md: "flex" }
                     }}
                     component={NextLink}
                     href='/'>
                     <Image src={logo} alt='logo' width={140} height={38} />
                  </Box>
               )}

               <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                  <IconButton
                     size='large'
                     aria-label='account of current user'
                     aria-controls='menu-appbar'
                     aria-haspopup='true'
                     onClick={handleOpenNavMenu}
                     sx={{ color: (theme) => theme.palette.primary.main }}>
                     <MenuIcon />
                  </IconButton>
                  <Menu
                     id='menu-appbar'
                     anchorEl={anchorElNav}
                     anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left"
                     }}
                     keepMounted
                     transformOrigin={{
                        vertical: "top",
                        horizontal: "left"
                     }}
                     open={Boolean(anchorElNav)}
                     onClose={handleCloseNavMenu}
                     sx={{
                        display: { xs: "block", md: "none" }
                     }}>
                     {_.map(layoutData?.MainMenu, (menuItem, index) => (
                        <MenuItem key={index} onClick={handleCloseNavMenu}>
                           <Typography
                              key={index}
                              onClick={handleCloseNavMenu}
                              display={"block"}
                              component={NextLink}
                              href={menuItem?.link ?? "/"}
                              target={menuItem?.target ?? "_self"}
                              //  color={currentPath === menu?.link ? 'primary.main' : 'text.disabled'}
                              sx={{
                                 textDecoration: "none",
                                 fontSize: 16,
                                 fontWeight: 500,
                                 "&:hover": {
                                    color: "primary.main"
                                 },
                                 color:
                                    currentPath === menuItem?.link
                                       ? (theme) => theme.palette.primary.main
                                       : (theme) => hexToRGBA(theme.palette.text.primary, 0.9)
                              }}>
                              {menuItem?.label ?? "No title"}
                           </Typography>
                        </MenuItem>
                     ))}
                  </Menu>
               </Box>
               {logo && (
                  <Box
                     sx={{
                        display: { xs: "none", sm: "flex", md: "none" },
                        flexGrow: 1
                     }}
                     component={NextLink}
                     href='/'>
                     <Image src={logo} alt='logo' width={140} height={38} />
                  </Box>
               )}
               <Box
                  sx={{
                     flexGrow: 1,
                     display: { xs: "none", md: "flex" },
                     justifyContent: "center"
                  }}>
                  <Stack direction={"row"} gap={3}>
                     {_.map(layoutData?.MainMenu, (item, index) => (
                        <Typography
                           key={index}
                           onClick={handleCloseNavMenu}
                           display={"block"}
                           component={NextLink}
                           href={item?.link ?? "/"}
                           target={item?.target ?? "_self"}
                           //   color={currentPath === page?.link ? 'primary.main' : 'text.disabled'}
                           sx={{
                              textDecoration: "none",
                              fontSize: 16,
                              fontWeight: 500,
                              "&:hover": {
                                 color: "primary.main"
                              },
                              color:
                                 currentPath === item?.link
                                    ? (theme) => theme.palette.primary.main
                                    : (theme) => hexToRGBA(theme.palette.text.primary, 0.9)
                           }}>
                           {item?.label ?? "No title"}
                        </Typography>
                     ))}
                  </Stack>
               </Box>

               <Box sx={{ flexGrow: 0 }}>
                  {status === "loading" && <LoadingButton loading variant='text'></LoadingButton>}
                  {status === "unauthenticated" && (
                     // <Stack direction={"row"} gap={2}>
                     <Stack direction={"row"} gap={1.5}>
                        {/* language-button  */}
                        <Box>
                           <Button
                              id='basic-button'
                              aria-controls={openLang ? "basic-menu" : undefined}
                              aria-haspopup='true'
                              aria-expanded={openLang ? "true" : undefined}
                              color='inherit'
                              variant='text'
                              onClick={handleClick}
                              sx={{
                                 textTransform: "capitalize",
                                 px: 0,
                                 display: "flex",
                                 fontSize: "1rem",
                                 gap: 1,
                                 color: theme.palette.text.primary
                              }}>
                              <CIcon
                                 icon='tabler:language'
                                 sx={{
                                    fontSize: "1.25rem"
                                 }}
                              />
                              <CIcon
                                 icon='ri:arrow-down-s-line'
                                 sx={{
                                    color: theme.palette.text.primary,
                                    transform: openLang ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: theme.transitions.create("transform", {
                                       duration: theme.transitions.duration.shortest
                                    })
                                 }}
                              />
                           </Button>
                           <Menu
                              id='basic-menu'
                              anchorEl={anchorEl}
                              open={openLang}
                              onClose={handleClose}
                              MenuListProps={{
                                 "aria-labelledby": "basic-button"
                              }}>
                              {_.map(langMenu, (lang, index) => (
                                 <MenuItem
                                    onClick={() => {
                                       if (lang?.link === "ar") {
                                          if (changeDirection) {
                                             changeDirection("rtl")
                                          }
                                          changeLang(lang?.link)
                                          window.location.reload()
                                       } else if (lang?.link === "en" || lang?.link === "es") {
                                          if (changeDirection) {
                                             changeDirection("ltr")
                                          }
                                          changeLang(lang?.link)
                                          window.location.reload()
                                       }
                                       handleClose()
                                    }}
                                    sx={{
                                       color: theme.palette.text.primary,
                                       px: 2,
                                       gap: 1.5,
                                       textAlign: "left",
                                       ":hover": {
                                          background: theme.palette.background.default,
                                          color: theme.palette.primary.main
                                       }
                                    }}
                                    key={index}>
                                    {lang?.link && (
                                       <CIcon
                                          icon={lang?.link}
                                          size={22}
                                          sx={{ color: theme.palette.text.primary + "60" }}
                                       />
                                    )}
                                    {lang?.label ?? "English"}
                                 </MenuItem>
                              ))}
                           </Menu>
                        </Box>

                        <IconButton sx={{ ml: 1, color: (theme) => theme.palette.text.primary }} onClick={toggleTheme}>
                           <CIcon icon={mode === "light" ? "ri:moon-fill" : "ri:sun-fill"} />
                        </IconButton>
                        <Button
                           size='small'
                           sx={{
                              py: 1
                           }}
                           variant='contained'
                           component={NextLink}
                           href='/login'>
                           Sign In
                        </Button>
                        <Button
                           size='small'
                           sx={{
                              py: 1,
                              backgroundColor: (theme) => theme.palette.secondary.main,
                              "&:hover": {
                                 backgroundColor: "primary.main"
                              }
                           }}
                           color={mode === "dark" ? "primary" : "secondary"}
                           variant='contained'
                           component={NextLink}
                           href='/register'>
                           Sign Up{" "}
                        </Button>
                     </Stack>
                  )}
                  {status === "authenticated" && data.user && (
                     <React.Fragment>
                        <Stack direction='row' gap={1.5} alignItems={"center"}>
                           {/* <CIcon icon='iconamoon:search-light' color='text.disabled' />
                           <CIcon icon='carbon:notification-new' color='text.disabled' /> */}

                           {/* language-button  */}
                           <Box>
                              <Button
                                 id='basic-button'
                                 aria-controls={openLang ? "basic-menu" : undefined}
                                 aria-haspopup='true'
                                 aria-expanded={openLang ? "true" : undefined}
                                 color='inherit'
                                 variant='text'
                                 onClick={handleClick}
                                 sx={{
                                    textTransform: "capitalize",
                                    display: "flex",
                                    fontSize: "1rem",
                                    gap: 1,
                                    color: theme.palette.text.primary
                                 }}>
                                 <CIcon
                                    icon='tabler:language'
                                    sx={{
                                       fontSize: "1.25rem"
                                    }}
                                 />
                                 {getLanguageValue(lang) || "English"}
                                 <CIcon
                                    icon='ri:arrow-down-s-line'
                                    sx={{
                                       color: theme.palette.text.primary,
                                       transform: openLang ? "rotate(180deg)" : "rotate(0deg)",
                                       transition: theme.transitions.create("transform", {
                                          duration: theme.transitions.duration.shortest
                                       })
                                    }}
                                 />
                              </Button>
                              <Menu
                                 id='basic-menu'
                                 anchorEl={anchorEl}
                                 open={openLang}
                                 onClose={handleClose}
                                 MenuListProps={{
                                    "aria-labelledby": "basic-button"
                                 }}>
                                 {_.map(langMenu, (lang, index) => (
                                    <MenuItem
                                       onClick={() => {
                                          if (lang?.link === "ar") {
                                             if (changeDirection) {
                                                changeDirection("rtl")
                                             }
                                             changeLang(lang?.link)
                                             window.location.reload()
                                          } else if (lang?.link === "en" || lang?.link === "es") {
                                             if (changeDirection) {
                                                changeDirection("ltr")
                                             }
                                             changeLang(lang?.link)
                                             window.location.reload()
                                          }
                                          handleClose()
                                       }}
                                       sx={{
                                          color: theme.palette.text.primary,
                                          px: 2,
                                          gap: 1.5,
                                          textAlign: "left",
                                          ":hover": {
                                             background: theme.palette.background.default,
                                             color: theme.palette.primary.main
                                          }
                                       }}
                                       key={index}>
                                       {lang?.link && (
                                          <CIcon
                                             icon={lang?.link}
                                             size={22}
                                             sx={{ color: theme.palette.text.primary + "60" }}
                                          />
                                       )}
                                       {lang?.label ?? "English"}
                                    </MenuItem>
                                 ))}
                              </Menu>
                           </Box>

                           <IconButton
                              sx={{ ml: 1, color: (theme) => theme.palette.text.primary }}
                              onClick={toggleTheme}>
                              <CIcon icon={mode === "light" ? "ri:moon-fill" : "ri:sun-fill"} />
                           </IconButton>
                           <IconButton size='large' color='inherit'>
                              <CIcon icon='tabler:bell' />
                           </IconButton>
                           <Stack direction='row' gap={1} alignItems={"center"}>
                              <Tooltip title='Open settings'>
                                 <Box
                                    onClick={handleOpenUserMenu}
                                    sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
                                    <IconButton sx={{ p: 0 }}>
                                       <Avatar
                                          alt={data.user.name ?? "user-avatar"}
                                          src={data?.user?.image ?? "https://placehold.co/40"}
                                       />
                                    </IconButton>
                                    {/* drop-menu-indicator icon  */}
                                    <Box
                                       sx={{
                                          display: "flex",
                                          alignItems: "flex-start",
                                          flexDirection: "column",
                                          maxWidth: "164px"
                                       }}>
                                       <Box
                                          sx={{
                                             display: "flex",
                                             alignItems: "center",
                                             gap: 1,
                                             width: "100%",
                                             justifyContent: "space-between"
                                          }}>
                                          {anchorElUser ? (
                                             <CIcon
                                                icon={"solar:round-alt-arrow-up-outline"}
                                                sx={{
                                                   color: theme.palette.text.primary
                                                }}
                                                fontSize={"24px"}
                                             />
                                          ) : (
                                             <CIcon
                                                icon={"solar:round-alt-arrow-down-outline"}
                                                sx={{
                                                   color: theme.palette.text.primary
                                                }}
                                                fontSize={"24px"}
                                             />
                                          )}
                                       </Box>
                                    </Box>
                                 </Box>
                              </Tooltip>
                           </Stack>
                        </Stack>
                        {/* dropdown-menu  */}
                        <Menu
                           sx={{
                              mt: "58px",
                              "& .MuiPaper-root": {
                                 minWidth: "180px",
                                 border: "1px solid",
                                 borderColor: theme.palette.divider,
                                 borderRadius: "12px",
                                 background: theme.palette.background.default,
                                 boxShadow: "0px 8px 28px -4px rgba(20, 28, 46, 0.08)"
                              }
                           }}
                           id='menu-appbar'
                           anchorEl={anchorElUser}
                           anchorOrigin={{
                              vertical: "top",
                              horizontal: "right"
                           }}
                           keepMounted
                           transformOrigin={{
                              vertical: "top",
                              horizontal: "right"
                           }}
                           open={Boolean(anchorElUser)}
                           onClose={handleCloseUserMenu}>
                           {_.map(layoutData?.userMenu, (setting, index) => (
                              <MenuItem
                                 key={index}
                                 onClick={handleCloseUserMenu}
                                 component={NextLink}
                                 href={setting?.link}
                                 target={setting?.target ?? "_self"}
                                 sx={{
                                    gap: 1,
                                    color: theme.palette.text.primary,
                                    ":hover": {
                                       background:
                                          setting?.label === "Logout"
                                             ? theme.palette.error.light
                                             : theme.palette.background.default,
                                       color:
                                          setting?.label === "Logout"
                                             ? theme.palette.error.dark
                                             : theme.palette.primary.main
                                    }
                                 }}>
                                 {setting?.icon && (
                                    <CIcon icon={setting?.icon} sx={{ color: theme.palette.text.primary + "60" }} />
                                 )}
                                 <Typography
                                    variant='body1'
                                    onClick={() => {
                                       if (setting?.label === "Logout") {
                                          LogOutHandler()
                                       }
                                    }}>
                                    {setting?.label}
                                 </Typography>
                              </MenuItem>
                           ))}
                        </Menu>
                     </React.Fragment>
                  )}
               </Box>
            </Toolbar>
         </Container>
      </AppBar>
   )
}
export default Header
