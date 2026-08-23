"use client";

import {
  Grid2X2,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  UserPlus,
  X,
} from "lucide-react";

import Link from "next/link";

import {
  useState,
} from "react";

import {
  logoutAction,
} from "@/app/actions/auth";

import {
  ThemeToggle,
} from "./theme-toggle";

import styles from "./site-shell.module.css";

type SiteHeaderClientProps = {
  isAuthenticated: boolean;
};

export function SiteHeaderClient({
  isAuthenticated,
}: SiteHeaderClientProps) {
  const [open, setOpen] =
    useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header
      className={
        styles.header
      }
    >
      <div
        className={
          styles.headerInner
        }
      >
        <Link
          href="/"
          className={
            styles.brand
          }
          onClick={
            closeMenu
          }
        >
          <span
            className={
              styles.brandMark
            }
          >
            <MapPin
              size={23}
            />
          </span>

          <span>
            <strong>
              Indica
              <em>
                Alagoas
              </em>
            </strong>

            <small>
              Profissionais e serviços
              perto de você
            </small>
          </span>
        </Link>

        <nav
          className={
            styles.desktopNav
          }
        >
          <Link href="/">
            Início
          </Link>

          <Link href="/buscar">
            Buscar
          </Link>

          <Link href="/categorias">
            Categorias
          </Link>

          <Link href="/como-funciona">
            Como funciona
          </Link>
        </nav>

        <div
          className={
            styles.headerActions
          }
        >
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link
                className={
                  styles.panelButton
                }
                href="/painel"
              >
                <Grid2X2
                  size={17}
                />

                Painel
              </Link>

              <form
                action={
                  logoutAction
                }
                className={
                  styles.headerLogoutForm
                }
              >
                <button
                  type="submit"
                  className={
                    styles.headerLogoutButton
                  }
                >
                  <LogOut
                    size={17}
                  />

                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                className={
                  styles.panelButton
                }
                href="/login"
              >
                <LogIn
                  size={17}
                />

                Login
              </Link>

              <Link
                className={
                  styles.loginButton
                }
                href="/cadastro"
              >
                <UserPlus
                  size={17}
                />

                Cadastrar
              </Link>
            </>
          )}

          <button
            type="button"
            className={
              styles.mobileMenuButton
            }
            onClick={() =>
              setOpen(
                (value) =>
                  !value,
              )
            }
            aria-label={
              open
                ? "Fechar menu"
                : "Abrir menu"
            }
            aria-expanded={
              open
            }
          >
            {open ? (
              <X size={21} />
            ) : (
              <Menu
                size={21}
              />
            )}
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            type="button"
            className={
              styles.mobileBackdrop
            }
            onClick={
              closeMenu
            }
            aria-label="Fechar menu"
          />

          <nav
            className={
              styles.mobileNav
            }
          >
            <Link
              href="/"
              onClick={
                closeMenu
              }
            >
              Início
            </Link>

            <Link
              href="/buscar"
              onClick={
                closeMenu
              }
            >
              Buscar
            </Link>

            <Link
              href="/categorias"
              onClick={
                closeMenu
              }
            >
              Categorias
            </Link>

            <Link
              href="/como-funciona"
              onClick={
                closeMenu
              }
            >
              Como funciona
            </Link>

            <div
              className={
                styles.mobileNavDivider
              }
            />

            {isAuthenticated ? (
              <>
                <Link
                  href="/painel"
                  onClick={
                    closeMenu
                  }
                  className={
                    styles.mobilePanelLink
                  }
                >
                  <Grid2X2
                    size={17}
                  />

                  Painel
                </Link>

                <form
                  action={
                    logoutAction
                  }
                  className={
                    styles.mobileLogoutForm
                  }
                >
                  <button
                    type="submit"
                    className={
                      styles.mobileLogoutButton
                    }
                  >
                    <LogOut
                      size={17}
                    />

                    Sair
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={
                    closeMenu
                  }
                  className={
                    styles.mobilePanelLink
                  }
                >
                  <LogIn
                    size={17}
                  />

                  Login
                </Link>

                <Link
                  href="/cadastro"
                  onClick={
                    closeMenu
                  }
                  className={
                    styles.mobileLoginLink
                  }
                >
                  <UserPlus
                    size={17}
                  />

                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </>
      )}
    </header>
  );
}