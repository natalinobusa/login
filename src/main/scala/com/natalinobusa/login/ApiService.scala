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
trait ApiService extends HttpService {

  implicit def executionContext = actorRefFactory.dispatcher
  implicit val timeout = Timeout(1.seconds)


  // user session route
  val userAuthRoute = {
    pathPrefix("auth") {
      pathPrefix("signin") {
        pathEnd {
          post {
            complete(
              Map( ("uid", "87ghsdq" ), ("email", "natalino.busa@gmail.com" ) )
            )
          }
        }
      } ~
        pathPrefix("signup") {
          pathEnd {
            post {
              complete(
                Map( ("uid", "87ghsdq" ), ("email", "natalino.busa@gmail.com" ) )
              )
            }
          }
        } ~
      pathPrefix("check") {
        pathEnd {
          post {
            complete("ok")
          }
        }
      } ~
      pathPrefix("destroy") {
        pathEnd {
          post {
            complete("ok")
          }
        }
      }
    }
  }

  val webappRoute = {
    pathSingleSlash {
        redirect("webapp/", StatusCodes.PermanentRedirect)
    } ~
    pathPrefix("webapp") {
      pathEnd {
        redirect("webapp/", StatusCodes.PermanentRedirect)
      } ~
      pathEndOrSingleSlash {
          getFromResource("webapp/index.html")
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
