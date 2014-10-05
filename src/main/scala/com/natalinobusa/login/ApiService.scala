package com.natalinobusa.streaming

// the service, actors and paths

import akka.actor._
import akka.util.Timeout
import scala.concurrent.duration._

import spray.routing.{RequestContext, HttpService}
import spray.can.Http
import spray.util._
import spray.http._
import MediaTypes._

import spray.json._
import DefaultJsonProtocol._
import spray.httpx.SprayJsonSupport.sprayJsonMarshaller

class ApiServiceActor extends Actor with ApiService {

  // the HttpService trait defines only one abstract member, which
  // connects the services environment to the enclosing actor or test
  def actorRefFactory = context

  // this actor only runs our route, but you could add
  // other things here, like request stream processing,
  // timeout handling or alternative handler registration
  def receive = runRoute(serviceRoute)

}

// Routing embedded in the actor
trait ApiService extends HttpService{

  // timeouts and implicit execution context for futures
  implicit def executionContext = actorRefFactory.dispatcher
  implicit val timeout = Timeout(1.seconds)

  // default logging
  implicit val log = LoggingContext.fromActorRefFactory

  // user session route
  val userAuthRoute = {
    pathPrefix("auth") {
      pathPrefix("signin") {
        pathEnd {
          post {
            log.info("entering auth/signin")
            cookie("csid") { csidCookie =>
              cookie("csrf") { csrfCookie =>
                headerValueByName("X-csrf-token") { csrfHeader =>
                  validate(csrfHeader == csrfCookie.content, "") {
                    validate( (csidCookie.content == "123sessionid123") && (csrfCookie.content == "abcdef"), "") {
                      log.info("cookie is ", csidCookie)
                      // might want to allow a stay signed in on the usid in combination with persistent storage on the user_csfr
                      val usidCookie = HttpCookie(name = "usid", content = "101010101", domain = Some(".timecrumbs.io"), path = Some("/"), httpOnly = true)
                      // regenerate csrf cookie after a successful login
                      val csrfCookie = HttpCookie(name = "csrf", content = "xyz", domain = Some(".timecrumbs.io"), path = Some("/"))
                      setCookie(usidCookie, csrfCookie) {
                        complete(
                          Map(("uid", "1"), ("username", "natalino.busa@gmail.com"))
                        )
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } ~
      pathPrefix("session") {
        pathEnd {
          post {
            complete("ok")
          }
        }
      }
    }
  }

  val webappRoute = {
    pathSingleSlash{
        redirect("webapp/", StatusCodes.PermanentRedirect)
    } ~
    pathPrefix( "webapp") {
      pathEnd {
        redirect("webapp/", StatusCodes.PermanentRedirect)
      } ~
      pathEndOrSingleSlash {
        val csrfCookie = HttpCookie(name = "csrf", content = "abcdef", domain=Some(".timecrumbs.io"), path=Some("/"))
          optionalCookie("csid") {
            case Some(csidCookie) => {
              val agentCookie = HttpCookie(name = "csid", content = csidCookie.content, domain = Some(".timecrumbs.io"), path = Some("/"), expires = Some(DateTime(2034, 12, 31)), httpOnly = true)
              log.info("already a csid, not creating")
              setCookie(agentCookie, csrfCookie) {
                getFromResource("webapp/index.html")
              }
            }
            case None => {
              log.info("no csid, creating one")
              val agentCookie = HttpCookie(name = "csid", content = "123sessionid123", domain = Some(".timecrumbs.io"), path = Some("/"), expires = Some(DateTime(2034, 12, 31)), httpOnly = true)
              setCookie(agentCookie, csrfCookie) {
                getFromResource("webapp/index.html")
              }
            }
        }
      } ~
      getFromResourceDirectory("webapp")
    } ~
    userAuthRoute
  }

  // placeholder for the api service
  val authRoute = complete("ok")

  val apiRoute = {
    pathPrefix("api") {
      authRoute
    }
  }

  val serviceRoute = apiRoute ~ webappRoute

}
